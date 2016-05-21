;(function () {
  var SIZE = Math.min($(window).height(), $(window).width())
  var svg = d3.select('.espace').append('svg')
    .attr('width', SIZE)
    .attr('height', SIZE)

  var SystemeSolaire = {
    'selector': $('.espace'),
    'svg': svg,
    'info': {},
    '$info': $('.infos'),
    'objets': {},
    'rotation': {},
    'interval': {}
  }

  SystemeSolaire.selector.width(SIZE)
  SystemeSolaire.selector.height(SIZE)

  $.when(
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
    initRotation()
    console.log(SystemeSolaire)
  })

  function appendSoleil (astres) {
    $.each(astres, function (index, value) {
      value.svg = {}
      value.svg.astre = SystemeSolaire.svg.append('image')
        .attr('class', 'astre')
        .attr('id', index)
        .attr('href', value.img)
        .attr('width', setEchele(value.ajuste.diametre))
        .attr('height', setEchele(value.ajuste.diametre))
        .attr('x', setEchele(SystemeSolaire.info.ajuste.diametre / 2) - (setEchele(value.ajuste.diametre) / 2))
        .attr('y', setEchele(SystemeSolaire.info.ajuste.diametre / 2) - (setEchele(value.ajuste.diametre) / 2))

      value.$info = $('<div>')
        .addClass('info')
        .attr('id', index)
        .addClass('but')
        .append(
          $('<img>')
            .attr('src', value.img)
          , getInfoHtml(index, value)
            .css('display', 'none')
      )
        .appendTo(SystemeSolaire.$info)
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
        .attr('transform', 'rotate(' + rand(360, 0) + ', ' + setEchele(SystemeSolaire.info.ajuste.diametre / 2) + ', ' + setEchele(SystemeSolaire.info.ajuste.diametre / 2) + ')')

      value.$info = $('<div>')
        .addClass('info')
        .attr('id', index)
        .addClass('but')
        .append(
          $('<img>')
            .attr('src', value.img)
          , getInfoHtml(index, value)
            .css('display', 'none')
      )
        .appendTo(SystemeSolaire.$info)

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

  function initRotation () {
    SystemeSolaire.$pause = $('.controle #pause')
    SystemeSolaire.$play = $('.controle #play')

    SystemeSolaire.pause = function () {
      clearInterval(SystemeSolaire.interval.planetes)
      SystemeSolaire.$pause.hide()
      SystemeSolaire.$play.show()
    }

    SystemeSolaire.play = function () {
      SystemeSolaire.interval.planetes = setInterval(SystemeSolaire.rotation.planetes, 10)
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

  function rand (a, b) {
    return Math.floor(Math.random() * (a - b) + b)
  }

  function getInfoHtml (nom, objet) {
    var $html = $('<p>').append(
      $('<h1>').text(nom),
      $('<h3>').text('Taille:'),
      $('<p>').text(objet.diametre + 'km de diamètre'),
      $('<h3>').text('Masse:'),
      $('<p>').html(
        objet.masse + 'x',
        $('<span>')
          .addClass('pow')
          .text(objet.massePow),
        'kg'
      ),
      $('<h3>').text('Distance de la Terre:'),
      $('<p>').text(objet.distanceTerre + ' UA'),
      $('<h3>').text('Révolution:'),
      $('<p>').text(objet.revolution),
      $('<h3>').text('Température:'),
      $('<p>').text('~ ' + objet.temperature + ' °C'),
      $('<h3>').text('Gravité:'),
      $('<p>').html(
        objet.gravite + ' m/s',
        $('<span>')
          .addClass('pow')
          .text(2),
        'kg'
      )
    )
    return $html
  }
})()
