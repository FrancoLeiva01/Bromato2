import { useQuery } from "@tanstack/react-query";
import { inspectorRepository } from "../repositories/inspectorRepository";

const useInspector = (query:{page:number, size:number, nombres:string, apellido:string}) => {
  const {
    data: inspectorData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["inspectores"],
    queryFn: () => inspectorRepository.findAll(query),
  });

  return { inspectorData, isLoading, error };
};

export default useInspector;


export const useFindOneInspector = () => {
const {
    data: inspector,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["inspector"],
    queryFn: () => inspectorRepository.getInspectores,
  });

  return { inspector, isLoading, error };
}