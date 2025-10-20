import useInspector from "../hook/useInspector";

export const InspectorTable = () => {

  const { isLoading, inspectorData } = useInspector({page:1,apellido:'',nombres:'',size:5});
  return (
    <>
      {isLoading ? (
        "esta loading "
      ) : (
        <>
          {
            <div>
              <span>
                {inspectorData}
                <button>ir a detalle</button>
              </span>
            </div>
          }
        </>
      )}
    </>
  );
};
