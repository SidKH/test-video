# Video test task
- Rendered 3 video boxes on the `index.html` page;  
- Each video box is an instance of the `VideoCustom` class;  
- `VideoCustom` extends from the `VideoExt` class;

### `VideoExt` class
- It's a basic layer for all video operations;  
- It contains all primitive video API work like `play` or `pause` methods;  
- Also it sets some classes on the container depending on the current state and trigger events.

### `VideoCustom` class
- It's a class that extends `VideoExt`;  
- It contains all navigation **components** for the video;  
- Each **component** is an object with keys `tpl` and `cb`;  
- `tpl` - contains template string of a **component** which will be rendered;  
- `cb` - is a function which will fired after **component** has rendered;
- `processEl` - is a function that processing **components** and make them work as expected.

### `CSS`
- Just a simple .css without any preprocessors
- Have used `normalize.css` and `font-awesome`
