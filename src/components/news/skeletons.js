import React from 'react'
import ContentLoader from 'react-content-loader'

export const NewsSkel = props => (
  <ContentLoader
        speed={2}
        width={400}
        height={460}
        viewBox="0 0 400 501"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <circle cx="35" cy="55" r="20" /> 
        <rect x="70" y="42" rx="2" ry="2" width="160" height="10" /> 
        <rect x="70" y="58" rx="2" ry="2" width="140" height="10" />

        <rect x="0" y="499" rx="3" ry="3" width="345" height="3" />
        <rect x="0" y="10" rx="3" ry="3" width="345" height="2" />

        <rect x="20" y="100" rx="2" ry="2" width="305" height="100" />
        <rect x="20" y="220" rx="2" ry="2" width="305" height="100" />
        <rect x="20" y="340" rx="2" ry="2" width="305" height="100" />
        <rect x="20" y="460" rx="2" ry="2" width="305" height="20" />

        <rect x="0" y="10" rx="3" ry="3" width="2" height="500" />
        <rect x="344" y="10" rx="3" ry="3" width="2" height="500" />
  </ContentLoader>
)