export const findCurrentPath = () => {
    const pathArray = __dirname.split('\\');
    const index = pathArray.findIndex((x) => x == 'app') + 1;
    const result = pathArray.splice(index);
    return result.join('\\');
}