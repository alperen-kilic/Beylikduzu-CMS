import { useEffect } from "react";
import { useStore } from "../../../stores/store";
import LoadingComponent from "../../../layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import CategoriesList from "./CategoriesList";

const CategoriesDashboard = observer(() => {
  const { categoriesStore } = useStore();
  const { loadCategories, categoriesRegistry, loadingInitial } = categoriesStore;

  useEffect(() => {
    if (categoriesRegistry.size <= 1) {
      loadCategories();
    }
  }, []);

  if (loadingInitial) return <LoadingComponent />;

  if (categoriesRegistry.size <= 0) return <div>No categories found</div>;

  return (
    <>
      <h1>Kategoriler</h1>
      <CategoriesList />
    </>
  );
});

export default CategoriesDashboard;
