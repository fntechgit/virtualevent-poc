import { useDispatch } from "react-redux";
import { getNow } from "../../store/actions/timer-actions";

export const useNow = () => {
    const dispatch = useDispatch();

    return dispatch(getNow());
}