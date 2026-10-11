// DCAT-AP_IT — the Italian application profile (AgID), harvested by dati.gov.it.
//
// Built on DCAT-AP (dcat-profiles.ts) and then adapted to what the AgID validator
// checks (https://validatore.dati.gov.it, rules in italia/daf-semantic-validator):
//   - every Catalog / Dataset / Distribution also typed dcatapit:*,
//   - publisher and rights holder as dcatapit:Agent with dct:identifier + foaf:name,
//   - contact point as dcatapit:Organization (vcard:fn + vcard:hasEmail),
//   - dct:rightsHolder and dct:accrualPeriodicity on every dataset,
//   - dct:license on every distribution, typed dcatapit:LicenseDocument.
//
// Spec: https://docs.italia.it/italia/daf/linee-guida-cataloghi-dati-dcat-ap-it/it/stabile/dcat-ap_it.html
//
// Manifest inputs (datasets.json, per-dataset `dcat` block): `themes` (EU data-theme
// URIs), `rightsHolder` ({ name, identifier, homepage }) and `accrualPeriodicity` (EU
// frequency URI). Catalog inputs (dcat.config.json): `publisher.identifier` next to the
// usual name/homepage, and `contactPoint`.

import type { DcatCatalog } from './dcat'
import {
  dcatApProfile,
  registerDcatProfile,
  type DcatConfig,
  type DcatProfile,
  type JsonLdNode,
} from './dcat-profiles'

type ItAgent = { name?: string; identifier?: string; homepage?: string }
type ItOverrides = { rightsHolder?: ItAgent; accrualPeriodicity?: string }

const DCATAPIT = 'http://dati.gov.it/onto/dcatapit#'

// A dcatapit:Agent node; undefined when name or identifier is missing (both are
// mandatory), so the validator reports the gap instead of a half-filled agent.
function agentNode(a?: ItAgent): JsonLdNode | undefined {
  if (!a?.name || !a.identifier) return undefined
  const node: JsonLdNode = {
    '@type': ['dcatapit:Agent', 'foaf:Agent'],
    'foaf:name': a.name,
    'dct:identifier': a.identifier,
  }
  if (a.homepage) node['@id'] = a.homepage
  return node
}

function contactNode(c?: DcatConfig['contactPoint']): JsonLdNode | undefined {
  if (!c?.fn || !c.email) return undefined
  return {
    '@type': ['dcatapit:Organization', 'vcard:Organization'],
    'vcard:fn': c.fn,
    'vcard:hasEmail': c.email.startsWith('mailto:') ? c.email : `mailto:${c.email}`,
  }
}

function licenseNode(uri: unknown): JsonLdNode | undefined {
  if (typeof uri !== 'string' || !uri) return undefined
  return { '@id': uri, '@type': ['dcatapit:LicenseDocument', 'dct:LicenseDocument'] }
}

function withType(node: JsonLdNode, itType: string): JsonLdNode {
  const types = node['@type'] === undefined ? [] : ([] as unknown[]).concat(node['@type'])
  return { ...node, '@type': [itType, ...types.filter((t) => t !== itType)] }
}

export const dcatApItProfile: DcatProfile = {
  id: 'dcat-ap-it',
  label: 'DCAT-AP_IT (dati.gov.it)',
  dcatVersion: '3',
  conformsTo: 'http://dati.gov.it/onto/dcatapit',
  context: { ...dcatApProfile.context, dcatapit: DCATAPIT },
  apply(base: DcatCatalog, cfg: DcatConfig) {
    // Read the per-dataset overrides before DCAT-AP strips the internal `_dcat` carrier.
    const overrides = ((base['dcat:dataset'] ?? []) as JsonLdNode[]).map(
      (d) => ((d as { _dcat?: ItOverrides })._dcat ?? {}) as ItOverrides
    )
    const catalog = dcatApProfile.apply(base, cfg)
    catalog['@context'] = { ...catalog['@context'], ...this.context }

    const publisher = agentNode(cfg.publisher as ItAgent | undefined)
    const contact = contactNode(cfg.contactPoint)

    const out = withType(catalog, 'dcatapit:Catalog') as typeof catalog
    if (publisher) out['dct:publisher'] = publisher
    else delete out['dct:publisher']
    out['dcat:themeTaxonomy'] = 'http://publications.europa.eu/resource/authority/data-theme'
    // The contact point belongs to datasets in DCAT-AP_IT, not to the catalog.
    delete out['dcat:contactPoint']

    out['dcat:dataset'] = ((catalog['dcat:dataset'] ?? []) as JsonLdNode[]).map((raw, i) => {
      const ov = overrides[i] ?? {}
      const ds = withType(raw, 'dcatapit:Dataset')
      // The base node uses the landing page as its @id; AgID wants the landing page to
      // be a plain foaf:Document, so the dataset gets its own IRI next to it.
      if (ds['@id'] && ds['@id'] === ds['dcat:landingPage']) ds['@id'] = `${ds['@id']}#dataset`
      if (publisher) ds['dct:publisher'] = publisher
      else delete ds['dct:publisher']
      if (contact) ds['dcat:contactPoint'] = contact
      else delete ds['dcat:contactPoint']
      const holder = agentNode(ov.rightsHolder)
      if (holder) ds['dct:rightsHolder'] = holder
      if (ov.accrualPeriodicity) ds['dct:accrualPeriodicity'] = ov.accrualPeriodicity
      // Themes are skos:Concept nodes in DCAT-AP_IT (the AgID validator warns when the
      // feed has no skos:Concept at all).
      if (ds['dcat:theme']) {
        ds['dcat:theme'] = ([] as unknown[])
          .concat(ds['dcat:theme'])
          .map((t) => (typeof t === 'string' ? { '@id': t, '@type': 'skos:Concept' } : t))
      }
      const license = licenseNode(ds['dct:license'])
      ds['dcat:distribution'] = ((ds['dcat:distribution'] ?? []) as JsonLdNode[]).map((d) => {
        const dist = withType(d, 'dcatapit:Distribution')
        if (license && !dist['dct:license']) dist['dct:license'] = license
        return dist
      })
      return ds
    })
    return out
  },
}

registerDcatProfile(dcatApItProfile)
