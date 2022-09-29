// css
import loadingCSS from '../../styles/loading.module.css'

function Loading({ color = 'dark' }) {

    return (
        <div className={color === 'dark' ? loadingCSS.loading : loadingCSS.loading_light}></div>
    )
}

export default Loading;