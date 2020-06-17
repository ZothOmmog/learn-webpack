import React from 'react';
import { render } from 'react-dom';
import * as $ from 'jquery';
import { Post } from '@models/Post';
import webPackLogo from './assets/webpack-logo';
import './Components/Header/index';
import './styles/less.less';
import './babel';

const post = new Post('Webpack Post Title', webPackLogo);

$('pre').addClass('code').html(post.toString());

console.log('Post to String', post.toString());

const App = () => (
    <div className='React'>React!</div>
)

render(<App />, document.querySelector('.root'));