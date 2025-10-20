import { useInspecttorFormik } from "../formik/useInspectorFormik"

export const CreateFormInspector = () => {
    const {handleSubmit, values, handleChange } = useInspecttorFormik()
    return <>
    <form onSubmit={handleSubmit} action="">
        <label>Nombres</label>
        <input value={values.nombres} onChange={handleChange} type="text" name="" id="" />
        <label>Apellidos</label>
        <input value={values.apellidos} onChange={handleChange} type="text" name="" id="" />
         <label>cuil</label>
        <input value={values.cuil} onChange={handleChange} type="text" name="" id="" />
         <label>nro_legajo</label>
        <input value={values.nro_legajo} onChange={handleChange} type="text" name="" id="" />

    </form>
    </>
}