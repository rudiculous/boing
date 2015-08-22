"use strict"

{Routes, View: {SimpleView}} = require '@rdcl/boing'

Routes.draw ->
  @use 'requestLogger'

#  @namespace 'admin', ->
#    @use 'login'
#    @root SimpleView('index')

  @get 'about-me', SimpleView('about_me')

  @resources 'blog'

  @root SimpleView('home')
