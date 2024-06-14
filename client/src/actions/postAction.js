import * as postApi from '../api/postRequest'

export const getTimelinePosts = (id) => async (dispatch) => {
    dispatch({ type: "RETREIVING_START" });
    try {
        const { data } = await postApi.getTimelinePosts(id);
        dispatch({ type: "RETREIVING_SUCCESS", data: data });
    } catch (error) {
        dispatch({ type: "RETREIVING_FAILURE" });
        console.log(error);
    }
}