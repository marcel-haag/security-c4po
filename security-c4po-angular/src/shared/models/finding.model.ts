import {v4 as UUID} from 'uuid';
import {Severity} from '@shared/models/severity.enum';

export class Finding {
  id?: string;
  title: string;
  description?: string;
  impact: string;
  severity: Severity;
  affectedUrls?: Array<string>;
  reproduction?: string;
  mitigation?: string;

  constructor(title: string,
              description: string,
              impact: string,
              severity: Severity,
              reproduction: string,
              id?: string,
              affectedUrls?: Array<string>,
              mitigation?: string) {
    this.id = id ? id : UUID();
    this.title = title;
    this.description = description;
    this.impact = impact;
    this.severity = severity;
    this.affectedUrls = affectedUrls ? affectedUrls : null;
    this.reproduction = reproduction;
    this.mitigation = mitigation ? mitigation : null;
  }
}

export interface FindingEntry {
  findingId: string;
  title: string;
  impact: string;
  severity: Severity;
  kind?: string;
  childEntries?: [];
  expanded?: boolean;
}

export function transformFindingsToObjectiveEntries(findings: Finding[]): FindingEntry[] {
  const findingEntries: FindingEntry[] = [];
  findings.forEach((value: Finding) => {
    findingEntries.push({
      findingId: value.id,
      title: value.title,
      impact: value.impact,
      severity: value.severity,
      kind: 'cell',
      childEntries: null,
      expanded: false
    } as FindingEntry);
  });
  return findingEntries;
}
