import express from 'express';
import serveIndex from 'serve-index';
import serveStatic from 'serve-static';
import config from './config';

const app = express();


app.use('/', serveIndex(config.models_path,
  {icons:true,
		filter:function(file,pos,list) {
			console.log(arguments);
			return (file.indexOf('.') === -1 || file.indexOf('stl') >= 1);
		}
	}
));

app.use('/', serveStatic(config.models_path));

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
