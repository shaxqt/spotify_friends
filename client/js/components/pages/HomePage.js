import React from 'react'
import Header from '../utils/Header'
import Headline from '../utils/Headline'
import Card from '../utils/Card'
import Main from '../utils/Main'

const HomePage = props => {
  return (
    <>
      <Header bgColor='blue'>
        <Headline>Ein text</Headline>
      </Header>
      <Main bgColor='red'>
        <Card title='Titel' text='text' />
        <Card title='Titel' text='text' />
        <Card title='Titel' text='text' />
        <Card title='Titel' text='text' />
        <Card title='Titel' text='text' />
        <Card title='Titel' text='text' />
        <Card title='Titel' text='text' />
        <Card title='Titel' text='text' />
        <Card title='Titel' text='text' />
        <Card title='Titel' text='text' />
        <Card title='Titel' text='text' />
        <Card title='Titel' text='text' />
        <Card title='Titel' text='text' />
      </Main>
      <nav>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
      </nav>
    </>
  )
}

export default HomePage
