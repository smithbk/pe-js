import { PresentationSubmission } from '@sphereon/pe-models';

import { VerifiableCredential } from '../verifiableCredential';

/***
 * Verifiable presentation - generic
 */
export class Presentation {
  context: Array<string>;
  presentation_submission: PresentationSubmission;
  type: Array<string>;
  verifiableCredential: Array<VerifiableCredential>;
  proof: any;

  public constructor(
    context: Array<string>,
    presentation_submission: PresentationSubmission,
    type: Array<string>,
    verifiableCredential: Array<VerifiableCredential>,
    proof: any
  ) {
    this.context = context;
    this.presentation_submission = presentation_submission;
    this.type = type;
    this.verifiableCredential = verifiableCredential;
    this.proof = proof;
  }
}
