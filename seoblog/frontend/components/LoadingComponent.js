const Loading = ({text, ...divProps}) => {
    if (text === undefined) {
        text = '';
    }
    return (<div className='alert alert-info' {...divProps}>{`Loading ${text}...`}</div>);
}

export default Loading;