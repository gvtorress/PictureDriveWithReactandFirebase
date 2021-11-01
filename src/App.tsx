import { useEffect, useState, FormEvent } from "react"
import { Container, Area, Header, ScreenWarning, PhotoList, UploadForm } from "./App.styles"
import { getAll, insert, deleteFile } from "./services/photos"
import { PhotoItem } from "./components/PhotoItem"

import { Photo } from "./types/Photo"

const App = () => {

  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true)
      setPhotos(await getAll())
      setLoading(false)
    }
    
    getPhotos()

  }, [])

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const file = formData.get('image') as File

    if (file && file.size > 0) {
      setUploading(true)
      let result = await insert(file)
      setUploading(false)

      if (result instanceof Error) {
        alert(`${result.name}-${result.message}`)
      } else {
        let newPhotoList = [...photos]
        newPhotoList.push(result)
        setPhotos(newPhotoList)
      }
    }

  }

  const handleDelete = async (name: string) => {
    setLoading(true)
    await deleteFile(name)
    let newPhotoList = [...photos]
    for (let i in newPhotoList) {
      if ( newPhotoList[i].name === name) {
        newPhotoList.splice(Number(i), 1)
      }
    }
    setPhotos(newPhotoList)
    setLoading(false)
  }

  return (
    <Container>
      <Area>
        <Header>Galeria de Fotos</Header>
        
          <UploadForm method="PoST" onSubmit={handleFormSubmit}>
            <input type="file" name="image" />
            <input type="submit" value="Enviar" />
            {uploading && "Enviando"}
          </UploadForm>

          {loading &&
            <ScreenWarning>
              <div className="emoji">🤚</div>
              <div>Carregando...</div>
            </ScreenWarning>
          }

        {!loading && photos.length >0 &&
          <PhotoList>
            {photos.map((item, index) => (
              <PhotoItem key={index} url={item.url} name={item.name} handleClick={() => handleDelete(item.name)} />
            ))}
          </PhotoList>
        }

        {!loading && photos.length === 0 &&
          <ScreenWarning>
          <div className="emoji">😔</div>
          <div>Não há fotos</div>
        </ScreenWarning>
        }

      </Area>
    </Container>
  )
}

export default App