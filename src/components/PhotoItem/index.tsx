import { Container } from "./styles"

type Props = {
    url: string,
    name: string,
    handleClick(): void 
}

export const PhotoItem = ({url, name, handleClick}: Props) => {
    return (
        <Container>
            <img src={url} alt={name} />
            {name}
            <button onClick={handleClick}>Delete</button>
        </Container>
    )
}