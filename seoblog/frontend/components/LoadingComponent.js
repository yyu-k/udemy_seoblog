const Loading = ({text}) => {
    if (text === undefined) {
        text = '';
    }
    return (<div className='alert alert-info'>{`Loading ${text}...`}</div>);
}

export default Loading;