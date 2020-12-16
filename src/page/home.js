import React from 'react'
import CarouselComp from './Carousel'
import Products from './product'



export default function Home(props) {
    console.log(props)
    return (
        <div>
            <CarouselComp />
            <Products />
        </div>
    )

}