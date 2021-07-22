import SummitObject from '../content/summit.json';

export const requireExtraQuestions = (profile) => {
    const requiredExtraQuestions = SummitObject.summit.order_extra_questions.filter(q => q.mandatory === true);
    if (requiredExtraQuestions.length > 0 && profile) {
        const ticketExtraQuestions = profile?.summit_tickets[0]?.owner?.extra_questions || [];
        if (ticketExtraQuestions.length > 0) {
            return !requiredExtraQuestions.every(q => {
                const answer = ticketExtraQuestions.find(answer => answer.question_id === q.id);
                return answer && answer.value;
            });
        } else {
            return true;
        }
    } else {
        return false;
    }
}