import { PresentationDefinition } from '@sphereon/pe-models';

import { Checked, Status } from '../ConstraintUtils';
import { VerifiablePresentation } from '../verifiablePresentation';

import { EvaluationHandler } from './evaluationHandler';
import { HandlerCheckResult } from './handlerCheckResult';
import { InputDescriptorFilterEvaluationHandler } from './inputDescriptorFilterEvaluationHandler';
import { LimitDisclosureEvaluationHandler } from './limitDisclosureEvaluationHandler';
import { MarkForSubmissionEvaluationHandler } from './markForSubmissionEvaluationHandler';
import { PredicateRelatedFieldEvaluationHandler } from './predicateRelatedFieldEvaluationHandler';
import { SameSubjectEvaluationHandler } from './sameSubjectEvaluationHandler';
import { SubjectIsIssuerEvaluationHandler } from './subjectIsIssuerEvaluationHandler';
import { UriEvaluationHandler } from './uriEvaluationHandler';

export class EvaluationClient {
  constructor() {
    this._results = [];
    this._verifiablePresentation = null;
  }

  private failed_catched: Checked = {
    tag: 'root',
    status: Status.ERROR,
    message: 'unknown exception occurred: ',
  };

  private _results: HandlerCheckResult[];
  private _verifiablePresentation: VerifiablePresentation;

  public evaluate(pd: PresentationDefinition, vp: VerifiablePresentation): void {
    let currentHandler: EvaluationHandler = this.initEvaluationHandlers();
    currentHandler.handle(pd, vp);
    while (currentHandler.hasNext()) {
      currentHandler = currentHandler.getNext();
      try {
        currentHandler.handle(pd, vp);
      } catch (e) {
        this.failed_catched.message += e.message;
        throw this.failed_catched;
      }
    }
  }

  public get results(): HandlerCheckResult[] {
    return this._results;
  }

  public get verifiablePresentation(): VerifiablePresentation {
    return this._verifiablePresentation;
  }

  public set verifiablePresentation(verifiablePresentation: VerifiablePresentation) {
    this._verifiablePresentation = verifiablePresentation;
  }

  private initEvaluationHandlers() {
    const uriEvaluation = new UriEvaluationHandler(this);

    uriEvaluation
      .setNext(new InputDescriptorFilterEvaluationHandler(this))
      .setNext(new PredicateRelatedFieldEvaluationHandler(this))
      .setNext(new MarkForSubmissionEvaluationHandler(this))
      .setNext(new LimitDisclosureEvaluationHandler(this))
      .setNext(new SubjectIsIssuerEvaluationHandler(this))
      .setNext(new SameSubjectEvaluationHandler(this));

    return uriEvaluation;
  }
}
