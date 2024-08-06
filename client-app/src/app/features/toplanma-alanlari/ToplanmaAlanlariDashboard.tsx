import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import LoadingComponent from "../../layout/LoadingComponent";
import ToplanmaAlanlariList from "./ToplanmaAlanlariList";
import { PagingParams } from "../../models/pagination";

const ToplanmaAlanlariDashboard = observer(() => {
  const { areasStore } = useStore();
  const { loadAreas, areasRegistry, setPagingParams, pagination, loadingInitial } = areasStore;

  useEffect(() => {
    if (areasRegistry.size <= 1) {
      loadAreas();
      if (pagination) {
        setPagingParams(new PagingParams(pagination.currentPage + 1));
      }
    }
  }, []);

  if (areasRegistry.size <= 1 && !pagination) return <LoadingComponent />;

  if (areasRegistry.size <= 0 && !loadingInitial) return <div>Toplanma alanı yok.</div>;

  return (
    <>
      <h1>Toplanma Alanları</h1>
      <ToplanmaAlanlariList />
    </>
  );
});

export default ToplanmaAlanlariDashboard;
