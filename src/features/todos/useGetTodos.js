import { useCallback } from "react";
import { useLazyLoadTodosQuery } from "./todosApiSlice";
import { useDispatch } from "react-redux";
import { setTodos } from "./todosSlice";

export default function useGetTodos() {
  const dispatch = useDispatch();
  const [loadTodos] = useLazyLoadTodosQuery();

  return useCallback(async () => {
    try {
      const response = await loadTodos().unwrap();
      dispatch(setTodos(response.results));
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, loadTodos]);
}
