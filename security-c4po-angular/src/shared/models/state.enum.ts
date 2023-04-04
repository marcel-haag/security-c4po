export enum ReportState {
  NEW,
  NEEDS_MORE_INFO,
  // Report states depending on customer feedback
  PRE_SUBMISSION,
  PENDING,
  TRIAGED,
  RETESTING,
  // Report states for closed submissions
  RESOLVED,
  INFORMATIVE,
  DUPLICATE,
  NOT_APPLICABLE,
  SPAM,
  OUT_OF_SCOPE,
  ACCEPTED_RISK
}

export const reportStateTexts: Array<ReportStateText> = [
  {value: ReportState.NEW, translationText: 'state.new'},
  {value: ReportState.NEEDS_MORE_INFO, translationText: 'state.needs_more_info'},
  // Report states depending on customer feedback
  {value: ReportState.PRE_SUBMISSION, translationText: 'state.pre_submission'},
  {value: ReportState.PENDING, translationText: 'state.pending'},
  {value: ReportState.TRIAGED, translationText: 'state.triaged'},
  {value: ReportState.RETESTING, translationText: 'state.retesting'},
  // Report states for closed submissions
  {value: ReportState.RESOLVED, translationText: 'state.resolved'},
  {value: ReportState.INFORMATIVE, translationText: 'state.informative'},
  {value: ReportState.DUPLICATE, translationText: 'state.duplicate'},
  {value: ReportState.NOT_APPLICABLE, translationText: 'state.not_applicable'},
  {value: ReportState.SPAM, translationText: 'state.spam'},
  {value: ReportState.OUT_OF_SCOPE, translationText: 'state.out_of_scope'},
  {value: ReportState.ACCEPTED_RISK, translationText: 'state.accepted_risk'}
];

export interface ReportStateText {
  value: ReportState;
  translationText: string;
}
