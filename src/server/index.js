import express from 'express';
import serveIndex from 'serve-index';

const app = express();


app.use('/models', serveIndex('/Users/michaelniepel/Dropbox/3dprinter/models',
  {icons:true,
		filter:function(file,pos,list) {
			console.log(arguments);
			return (file.indexOf('.') === -1 || file.indexOf('stl') >= 1);
		}
	}
));

app.get('/api', (req, res) => {
  res.json({
    shouts: [
      'Hello World!',
      'This is React and Webpack...',
      'They make development fun',
      'Another shout'
    ]
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    hello: "world"
  });
});

app.post('/api/test/test', (req, res) => {
  res.json({
    hello: "world'"
  });
});

app.listen(8080, function(err) {
  if (err)
    return console.log(err);
  console.log('running on localhost:8080');
});