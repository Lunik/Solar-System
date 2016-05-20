;(function () {
  var SIZE = Math.min($(window).height(), $(window).width())
  var svg = d3.select('.espace').append('svg')
    .attr('width', SIZE)
    .attr('height', SIZE)

  var SystemeSolaire = {
    'selector': $('.espace'),
    'svg': svg,
    'info': {},
    'objets': {},
    'rotation': {},
    'interval': {}
  }

  SystemeSolaire.selector.width(SIZE)
  SystemeSolaire.selector.height(SIZE)

  $.when(
    $.getJSON('src/data/asteroides.json', function (data) {
      SystemeSolaire.objets.asteroides = data
    }),
    $.getJSON('src/data/astres.json', function (data) {
      SystemeSolaire.objets.astres = data
    }),
    $.getJSON('src/data/autres.json', function (data) {
      SystemeSolaire.objets.autres = data
    }),
    $.getJSON('src/data/planetes.json', function (data) {
      SystemeSolaire.objets.planetes = data
    }),
    $.getJSON('src/data/systemesolaire.json', function (data) {
      SystemeSolaire.info = data
    })
  ).then(function () {
    appendSoleil(SystemeSolaire.objets.astres)
    appendAstres($.extend(SystemeSolaire.objets.planetes, SystemeSolaire.objets.autres))
    appendAsteroides(SystemeSolaire.objets.asteroides)
    initRotation()
  })

  function appendSoleil (astres) {
    $.each(astres, function (index, value) {
      SystemeSolaire.svg.append('image')
        .attr('class', 'astre')
        .attr('id', index)
        .attr('href', value.img)
        .attr('width', setEchele(value.ajuste.diametre))
        .attr('height', setEchele(value.ajuste.diametre))
        .attr('x', setEchele(SystemeSolaire.info.ajuste.diametre / 2) - (setEchele(value.ajuste.diametre) / 2))
        .attr('y', setEchele(SystemeSolaire.info.ajuste.diametre / 2) - (setEchele(value.ajuste.diametre) / 2))
    })
  }

  function appendAstres (planetes) {
    $.each(planetes, function (index, value) {
      value.svg = {}

      // Append orbite
      value.svg.orbite = SystemeSolaire.svg.append('circle')
        .attr('class', 'orbite')
        .attr('id', index)
        .attr('cx', setEchele(SystemeSolaire.info.ajuste.diametre / 2))
        .attr('cy', setEchele(SystemeSolaire.info.ajuste.diametre / 2))
        .attr('r', setEchele(value.ajuste.orbitDiametre))

      // Append planete
      value.svg.planete = SystemeSolaire.svg.append('image')
        .attr('class', 'planete')
        .attr('id', index)
        .attr('href', value.img)
        .attr('x', setEchele(SystemeSolaire.info.ajuste.diametre / 2) - (setEchele(value.ajuste.diametre) / 2) - setEchele(value.ajuste.orbitDiametre) / 1.41)
        .attr('y', setEchele(SystemeSolaire.info.ajuste.diametre / 2) - (setEchele(value.ajuste.diametre) / 2) - setEchele(value.ajuste.orbitDiametre) / 1.41)
        .attr('width', setEchele(value.ajuste.diametre))
        .attr('height', setEchele(value.ajuste.diametre))
        .attr('transform', 'rotate('+ Math.floor(Math.random() * (360 - 0)) + ', ' + setEchele(SystemeSolaire.info.ajuste.diametre / 2) + ', ' + setEchele(SystemeSolaire.info.ajuste.diametre / 2) + ')')
    })

    // Rotation
    SystemeSolaire.rotation.planetes = function () {
      $.each(planetes, function (index, value) {
        var nextAngle = value.svg.planete.attr('transform').split(',')[0].split('(')[1]
        nextAngle = parseFloat(nextAngle) + 1 * (365 / value.revolution)
        if (nextAngle >= 360) nextAngle = 0
        value.svg.planete.attr('transform', 'rotate(' + nextAngle + ',' + setEchele(SystemeSolaire.info.ajuste.diametre / 2) + ', ' + setEchele(SystemeSolaire.info.ajuste.diametre / 2) + ')')
      })
    }
  }

  function appendAsteroides(asteroides){
    $.each(asteroides, function (index, value) {
      value.svg = {}

      // Append orbite
      value.svg.orbite = SystemeSolaire.svg.append('circle')
        .attr('class', 'asteroides')
        .attr('id', index)
        .attr('cx', setEchele(SystemeSolaire.info.ajuste.diametre / 2))
        .attr('cy', setEchele(SystemeSolaire.info.ajuste.diametre / 2))
        .attr('r', setEchele(value.ajuste.orbitDiametre))
        .attr('stroke-width', value.ajuste.largeur)
        .attr('transform', 'rotate('+ Math.floor(Math.random() * (360 - 0)) + ', ' + setEchele(SystemeSolaire.info.ajuste.diametre / 2) + ', ' + setEchele(SystemeSolaire.info.ajuste.diametre / 2) + ')')

        SystemeSolaire.rotation.asteroides = function(){
          $.each(asteroides, function (index, value) {
            var nextAngle = value.svg.orbite.attr('transform').split(',')[0].split('(')[1]
            nextAngle = parseFloat(nextAngle) + 0.5 * value.ajuste.vitesse
            if (nextAngle >= 360) nextAngle = 0
            value.svg.orbite.attr('transform', 'rotate(' + nextAngle + ',' + setEchele(SystemeSolaire.info.ajuste.diametre / 2) + ', ' + setEchele(SystemeSolaire.info.ajuste.diametre / 2) + ')')
          })
        }
      })
  }

  function initRotation(){
    SystemeSolaire.$pause = $('.controle #pause')
    SystemeSolaire.$play = $('.controle #play')

    SystemeSolaire.pause = function(){
      clearInterval(SystemeSolaire.interval.planetes)
      clearInterval(SystemeSolaire.interval.asteroides)
      SystemeSolaire.$pause.hide()
      SystemeSolaire.$play.show()
    }

    SystemeSolaire.play = function(){
      SystemeSolaire.interval.planetes = setInterval(SystemeSolaire.rotation.planetes, 10)
      SystemeSolaire.interval.asteroides = setInterval(SystemeSolaire.rotation.asteroides, 25)
      SystemeSolaire.$pause.show()
      SystemeSolaire.$play.hide()
    }

    SystemeSolaire.$pause.click(SystemeSolaire.pause)
    SystemeSolaire.$play.click(SystemeSolaire.play)

    SystemeSolaire.play()
  }

  function setEchele (distance) {
    return (SIZE * distance) / SystemeSolaire.info.ajuste.diametre
  }
})()
