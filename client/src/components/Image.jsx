export default function Image({ src, ...rest }) {

    src = src.includes('https://')
        ? src
        : process.env.REACT_APP_API_BASE_URL + '/uploads/' + src;

    return (
        <img {...rest} src={src} alt={''} />);
}