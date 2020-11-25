import React from 'react'
import ContentLoader from 'react-content-loader'
import { Hidden } from '@material-ui/core'

const Article = props => {
    return (
        <React.Fragment>
            <Hidden smDown>
                <ContentLoader viewBox="0 0 476 100" height={160} {...props}>
                    <rect x="0" y="13" rx="4" width="400" height="9" />
                    <rect x="0" y="29" rx="4" width="100" height="8" />
                    <rect x="0" y="50" rx="4" width="400" height="10" />
                    <rect x="0" y="65" rx="4" width="400" height="10" />
                    <rect x="0" y="79" rx="4" width="100" height="10" />
                    <rect x="0" y="99" rx="5" width="400" height="200" />
                </ContentLoader>
            </Hidden>
            <Hidden mdUp smDown>
                <ContentLoader viewBox="0 0 476 100" height={160} {...props}>
                    <rect x="0" y="13" rx="4" width="400" height="9" />
                    <rect x="0" y="29" rx="4" width="100" height="8" />
                    <rect x="0" y="50" rx="4" width="400" height="10" />
                    <rect x="0" y="65" rx="4" width="400" height="10" />
                    <rect x="0" y="79" rx="4" width="100" height="10" />
                    <rect x="0" y="99" rx="5" width="400" height="200" />
                </ContentLoader>
            </Hidden>
            <Hidden smUp>
                <ContentLoader viewBox="0 0 476 100" height={80} {...props}>
                    <rect x="0" y="13" rx="4" width="400" height="9" />
                    <rect x="0" y="29" rx="4" width="100" height="8" />
                    <rect x="0" y="50" rx="4" width="400" height="10" />
                    <rect x="0" y="65" rx="4" width="400" height="10" />
                    <rect x="0" y="79" rx="4" width="100" height="10" />
                    <rect x="0" y="99" rx="5" width="400" height="200" />
                </ContentLoader>
            </Hidden>
        </React.Fragment>
    );
}

export default Article