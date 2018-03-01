"use strict";
import dopts = require("default-options");

import ContractWrapperFactory from "../ContractWrapperFactory";
import {
  Address,
  ArcTransactionProposalResult,
  ExtendTruffleContract,
  Hash,
} from "../ExtendTruffleContract";
import { Utils } from "../utils";
import { ProposalDeletedEventResult, ProposalExecutedEventResult } from "./commonEventInterfaces";

const SolidityContract = Utils.requireContract("GlobalConstraintRegistrar");

export class GlobalConstraintRegistrarWrapper extends ExtendTruffleContract {

  /**
   * Events
   */

  /* tslint:disable:max-line-length */
  public NewGlobalConstraintsProposal = this.createEventFetcherFactory<NewGlobalConstraintsProposalEventResult>("NewGlobalConstraintsProposal");
  public RemoveGlobalConstraintsProposal = this.createEventFetcherFactory<RemoveGlobalConstraintsProposalEventResult>("RemoveGlobalConstraintsProposal");
  public ProposalExecuted = this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted");
  public ProposalDeleted = this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted");
  /* tslint:enable:max-line-length */

  public async proposeToAddModifyGlobalConstraint(opts = {}) {
    const defaults = {
      /**
       * avatar address
       */
      avatar: undefined,
      /**
       *  the address of the global constraint to add
       */
      globalConstraint: undefined,
      /**
       * hash of the parameters of the global contraint
       */
      globalConstraintParametersHash: undefined,
      /**
       * voting machine to use when voting to remove the global constraint
       */
      votingMachineHash: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("address is not defined");
    }

    if (!options.globalConstraint) {
      throw new Error("globalConstraint is not defined");
    }

    if (!options.globalConstraintParametersHash) {
      throw new Error("globalConstraintParametersHash is not defined");
    }

    if (!options.votingMachineHash) {
      throw new Error("votingMachineHash is not defined");
    }

    const tx = await this.contract.proposeGlobalConstraint(
      options.avatar,
      options.globalConstraint,
      options.globalConstraintParametersHash,
      options.votingMachineHash
    );

    return new ArcTransactionProposalResult(tx);
  }

  public async proposeToRemoveGlobalConstraint(opts = {}) {
    const defaults = {
      /**
       * avatar address
       */
      avatar: undefined,
      /**
       *  the address of the global constraint to remove
       */
      globalConstraint: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.globalConstraint) {
      throw new Error("avatar globalConstraint is not defined");
    }

    const tx = await this.contract.proposeToRemoveGC(
      options.avatar,
      options.globalConstraint
    );

    return new ArcTransactionProposalResult(tx);
  }

  public async setParams(params) {
    return super.setParams(
      params.voteParametersHash,
      params.votingMachine
    );
  }

  public getDefaultPermissions(overrideValue?: string) {
    return overrideValue || "0x00000007";
  }
}

const GlobalConstraintRegistrar = new ContractWrapperFactory(SolidityContract, GlobalConstraintRegistrarWrapper);
export { GlobalConstraintRegistrar };

export interface NewGlobalConstraintsProposalEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  /**
   * indexed
   */
  _intVoteInterface: Address;
  _gc: Address;
  _params: Hash;
  /**
   * indexed
   */
  _proposalId: Hash;
  _voteToRemoveParams: Hash;
}

export interface RemoveGlobalConstraintsProposalEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  _gc: Address;
  /**
   * indexed
   */
  _intVoteInterface: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
}