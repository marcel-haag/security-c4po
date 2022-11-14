import {v4 as UUID} from 'uuid';
import {Severity} from '@shared/models/severity.enum';

export class Finding {
  id?: string;
  severity: Severity;
  title: string;
  description: string;
  impact: string;
  affectedUrls?: Array<string>;
  reproduction: string;
  mitigation?: string;

  constructor(title: string,
              severity: Severity,
              description: string,
              impact: string,
              reproduction: string,
              id?: string,
              affectedUrls?: Array<string>,
              mitigation?: string) {
    this.id = id ? id : UUID();
    this.severity = severity;
    this.title = title;
    this.description = description;
    this.impact = impact;
    this.affectedUrls = affectedUrls ? affectedUrls : null;
    this.reproduction = reproduction;
    this.mitigation = mitigation ? mitigation : null;
  }
}

export interface FindingEntry {
  findingId: string;
  severity: Severity;
  title: string;
  impact: string;
  kind?: string;
  childEntries?: [];
  expanded?: boolean;
}

export function transformFindingsToObjectiveEntries(findings: Finding[]): FindingEntry[] {
  const findingEntries: FindingEntry[] = [];
  findings.forEach((value: Finding) => {
    findingEntries.push({
      findingId: value.id,
      severity: typeof value.severity !== 'number' ? Severity[value.severity] : value.severity,
      title: value.title,
      impact: value.impact,
      kind: 'cell',
      childEntries: null,
      expanded: false
    } as unknown as FindingEntry);
  });
  return findingEntries;
}

export function transformFindingToRequestBody(finding: FindingDialogBody | Finding): Finding {
  const transformedFinding = {
    ...finding,
    severity: typeof finding.severity === 'number' ? Severity[finding.severity] : finding.severity,
    title: finding.title,
    description: finding.description,
    impact: finding.impact,
    affectedUrls: finding.affectedUrls ? finding.affectedUrls : [],
    reproduction: finding.reproduction,
    mitigation: finding.mitigation,
    /* Remove Table Entry Object Properties */
    childEntries: undefined,
    kind: undefined,
    findings: undefined,
    expanded: undefined,
  } as unknown as Finding;
  return transformedFinding;
}

export interface FindingDialogBody {
  title: string;
  severity: Severity;
  description: string;
  impact: string;
  affectedUrls: Array<string>;
  reproduction: string;
  mitigation: string;
}
