/**
 * Copyright 2018-2020 Cargill Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function Circuit(data) {
  if (data.proposal_type) {
    this.id = data.circuit_id;
    this.status = 'Pending';
    this.members = data.circuit.members.map(member => {
      return member.node_id;
    });
    this.roster = data.circuit.roster;
    this.managementType = data.circuit.management_type;
    this.applicationMetadata = data.circuit.application_metadata;
    this.comments = data.circuit.comments;
    this.proposal = {
      votes: data.votes,
      requester: data.requester,
      requesterNodeID: data.requester_node_id,
      proposalType: data.proposal_type
    };
  } else {
    this.id = data.id;
    this.status = 'Active';
    this.members = data.members;
    this.roster = data.roster;
    this.managementType = data.management_type;
    this.applicationMetadata = data.application_metadata;
    this.comments = 'N/A';
    this.proposal = {
      votes: [],
      requester: '',
      requesterNodeID: '',
      proposalType: ''
    };
  }
}

function awaitingApproval() {
  if (this.status === 'Pending') {
    return true;
  }
  return false;
}

function actionRequired(nodeID) {
  const nodeHasVoted =
    this.proposal.votes.filter(vote => {
      return vote.voter_node_id === nodeID;
    }).length > 0;

  if (this.awaitingApproval() && !nodeHasVoted) {
    return true;
  }
  return false;
}

Circuit.prototype.awaitingApproval = awaitingApproval;
Circuit.prototype.actionRequired = actionRequired;

const processCircuits = circuits => {
  return circuits.map(item => {
    return new Circuit(item);
  });
};

export { processCircuits, Circuit };
