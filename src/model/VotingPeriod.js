import { PHASES } from '../utils/phasesUtils';
import { isValidUTC, getVotingPeriodPhase } from '../utils/phasesUtils';

export const VotingPeriod = (params, now) => {
  const isValidStartDate = isValidUTC(params.startDate);
  const isValidEndDate = isValidUTC(params.endDate);
  return {
    name: params.name ?? null,
    startDate: isValidStartDate ? params.startDate : null,
    endDate: isValidEndDate ? params.endDate : null,
    attendeeVotes: (Number.isInteger(params.attendeeVotes) || params.attendeeVotes === Infinity) && params.attendeeVotes >= 0 ? params.attendeeVotes : null,
    maxAttendeeVotes: (Number.isInteger(params.maxAttendeeVotes) || params.maxAttendeeVotes === Infinity) && params.maxAttendeeVotes >= 0 ? params.maxAttendeeVotes === 0 ? Infinity : params.maxAttendeeVotes : null,
    phase: // if no valid start date or end date, seems you can still vote in api
           isValidUTC(now) ?
           getVotingPeriodPhase({ startDate: params.startDate, endDate: params.endDate }, now) :
           Number.isInteger(params.phase) && (params.phase === PHASES.BEFORE || params.phase === PHASES.DURING || params.phase === PHASES.AFTER) ? params.phase : null,
    get remainingVotes() {
      if (this.attendeeVotes === this.maxAttendeeVotes === null) return null;
      if (this.attendeeVotes === null && this.maxAttendeeVotes !== null) return this.maxAttendeeVotes;
      return this.maxAttendeeVotes - this.attendeeVotes;
    },
    set addVotes(value) {
      if (!Number.isInteger(value) && value <= 0) return;
      this.attendeeVotes = this.attendeeVotes === null ? value : this.attendeeVotes + value;
    },
    set substractVotes(value) {
      if ((!Number.isInteger(value) && value <= 0) || this.attendeeVotes === null) return;
      this.attendeeVotes = this.attendeeVotes - value;
    }
  }
};