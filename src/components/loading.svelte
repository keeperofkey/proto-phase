<script lang='js' type=module>
    const svgContainer = document.getElementById('svg-container');

    // Load each SVG frame and add it to the container
    for (let i = 1; i <= 240; i++) {
    const svg = document.createElement('object');
        svg.type = 'image/svg+xml';
        svg.data = `svg/out${i.toString().padStart(4, 0)}.svg`;
        svgContainer.appendChild(svg);
    }

    // Play the animation by changing the visibility of each frame
    let currentFrame = 1;
    setInterval(() => {
        svgContainer.children[currentFrame - 1].style.visibility = 'hidden';
        currentFrame = (currentFrame % 240) + 1;
        svgContainer.children[currentFrame - 1].style.visibility = 'visible';
    }, 50);
</script>

<!DOCTYPE html>
<html lang=en>
  <head>
    <title>SVG Animation</title>
  </head>
  <body>
    <div id="svg-container"></div>
  </body>
</html>