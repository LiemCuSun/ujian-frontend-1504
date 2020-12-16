import React, { useState, useRef, useEffect } from 'react'
import Axios from 'axios'
// import AliceCarousel from 'react-alice-carousel'
// import "react-alice-carousel/lib/alice-carousel.css"
import Carousel from 'react-bootstrap/Carousel'



export default function CarouselComp() {
    let [galleryItem, setGalleryItem] = useState([])
    let [titleImg, setTitleImg] = useState([])
    let renderCount = useRef(1)
    useEffect(() => {
        renderCount.current = renderCount.current + 1
    })


    useEffect(() => {
        Axios.get("http://localhost:2000/products")
            .then((res) => {
                // console.log(res)
                let data = res.data
                // console.log(data[0].image)
                let gallery = []
                let tempTitle = []

                for (let i = 0; i < data.length; i++) {
                    gallery.push(data[i].img)
                }
                for (let i = 0; i < data.length; i++) {
                    tempTitle.push(data[i].name)
                }
                // console.log(gallery)
                // console.log(tempTitle)
                setGalleryItem(gallery)
                setTitleImg(tempTitle)
            })
            .catch((err) => console.log(err))
    }, [])

    // let responsive = {
    //     0: { items: 1 },
    //     1024: { items: 1 },
    // }



    console.log(`Carousel component rendered ${renderCount.current} times`)
    // console.log(galleryItem)
    // console.log(titleImg)
    return (
        <div style={styles.background}>
            <div style={styles.container}>
                <h1 className="text-center" style={{ marginTop: '180px', fontFamily: 'Sansita Swashed', }} >
                    "Good shoes takes you to good places"
                </h1>
            </div>
            <Carousel style={styles.container2}>
                {galleryItem.map((item, index) => {
                    return (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100" style={{ height: "520px" }}
                                src={item}
                                alt="First slide"
                            />
                            <Carousel.Caption key={index}>
                                <h3>{titleImg[index]}</h3>
                            </Carousel.Caption>
                        </Carousel.Item>
                    )
                })}
            </Carousel>
        </div>
    )

}

const styles = {
    background: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '100px',
        marginBottom: '50px'
        // height: '100vh',
        // background: "url(https://images.unsplash.com/photo-1449844908441-8829872d2607?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80) no-repeat center",
        // backgroundSize: '100vw 100vh'
    },
    container: {
        width: '500px',
        background: 'rgba(82, 192, 192, 0.9)',
        padding: '10px',
        borderRadius: '15px',
        margin: 'auto',
        height: '540px',
    },
    container2: {
        width: '800px',
        background: 'rgba(82, 192, 192, 0.7)',
        padding: '10px',
        borderRadius: '15px',
        margin: 'auto',
        height: '540px',
    },
}