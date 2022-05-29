
import { Avatar as AvatarAntd } from 'antd'
import { css } from '@emotion/css'

type TypePropertiesAvatar = React.ComponentProps<typeof AvatarAntd> & {
  avatarSrc?: string,
  fullName?: string
}
const AvatarZ = ({
  className = '',
  children,
  avatarSrc,
  fullName = '',
  size = 'small',
  src: source = avatarSrc ? `${import.meta.env.VITE_APP_STORAGE_URI}/${avatarSrc}` : undefined,
  ...properties
}: TypePropertiesAvatar) => {
  const stylesContainer = `${css`
      vertical-align: middle;
    `} ${className}`

  return (
    <AvatarAntd
      className={stylesContainer}
      src={source}
      shape="square"
      size={size}
      gap={2}
      {...properties}
    >
      {fullName.slice(0, 2)}
      {children}
    </AvatarAntd>
  )
}

export default AvatarZ
