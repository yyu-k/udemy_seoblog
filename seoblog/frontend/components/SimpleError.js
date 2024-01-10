export const SimpleError = ({error}) => {
    return (
        <div className="alert alert-danger container" role='alert'>
            {error}
        </div>
    )
}