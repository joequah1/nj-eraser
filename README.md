# eraser
Javascript canvas eraser npm package

# Install 
```
npm install nj-eraser --save
```

# Usage 
```
import Eraser from 'nj-eraser';

new Eraser({
    ele : document.getElementById('erase'),
    completeRatio : 0.3,
    startFunction : () => {
        this.tracker('E', 'scratch')
        document.getElementById('gesture').style.display = 'none'
    },
    completeFunction : () => {
        document.getElementById('first').classList.add('fade-out')
        document.getElementById('clickthrough').style.display = 'block'
        setTimeout(() => {
            document.getElementById('first').style.display = 'none'
        }, 1000)
    }
})
```