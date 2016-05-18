;(function () {
  var SIZE = Math.min($(window).height(), $(window).width())
  var svg = d3.select('.espace').append('svg')
    .attr('width', SIZE)
    .attr('height', SIZE)

  var SystemeSolaire = {
    'selector': $('.espace'),
    'svg': svg,
    'info': {},
    'objets': {}
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
    appendAstres(SystemeSolaire.objets.astres)
    appendPlanetes(SystemeSolaire.objets.planetes)

    initRotation()
  })

  function appendAstres (astres) {
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

  function appendPlanetes (planetes) {
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
        .attr('transform', 'rotate(0, ' + setEchele(SystemeSolaire.info.ajuste.diametre / 2) + ', ' + setEchele(SystemeSolaire.info.ajuste.diametre / 2) + ')')
    })

    // Rotation
    SystemeSolaire.rotation = function () {
      $.each(planetes, function (index, value) {
        var nextAngle = value.svg.planete.attr('transform').split(',')[0].split('(')[1]
        nextAngle = parseFloat(nextAngle) + 1 * (365 / value.revolution)
        if (nextAngle >= 360) nextAngle = 0
        value.svg.planete.attr('transform', 'rotate(' + nextAngle + ',' + setEchele(SystemeSolaire.info.ajuste.diametre / 2) + ', ' + setEchele(SystemeSolaire.info.ajuste.diametre / 2) + ')')
      })
    }
  }

  function initRotation(){
    SystemeSolaire.$pause = $('.controle #pause')
    SystemeSolaire.$play = $('.controle #play')

    SystemeSolaire.pause = function(){
      clearInterval(SystemeSolaire.interval)
      SystemeSolaire.$pause.hide()
      SystemeSolaire.$play.show()
    }

    SystemeSolaire.play = function(){
      SystemeSolaire.interval = setInterval(SystemeSolaire.rotation, 10)
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
