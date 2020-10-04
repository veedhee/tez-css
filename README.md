# tez-css

Include only relevant CSS to your page for faster performance.

## What & Why

The heaviest resources that the browser requests for while loading a web page are images, JS and CSS. Each have their own passage of rite to be optimized.

This package will help you optimize your CSS files so you do not call any rules that a particular page needs. Keep a master file for all your designs and only include those that you need.

Sometimes, you have a stye guide that has been implemented very well. Four kinds of buttons for different uses. Three kinds of card layouts, and so much more. And many times, you only need one component out of the multiple you have defined.

It might be a small change, but it is one.

> Tez-CSS is a front-end development utility that will help the user to handpick style blocks required for a particular pae before including them in a page.
You can have multiple master CSS files that define your entire website style, but the developers have the power to include the desired blocks from multiple files into a single file which can then be minimized.

[x] Generate once
[x] Easy to use JSON configuration
[x] Generates a single file
[x] Can be cached

## Usage

To install:
```
npm install tez-css
```

Create a file ```tez-css.config.json```. This file defines the output CSS file, the input CSS files, and the blocks to be fetched.

Example content for ```tez-css.config.json```:
```json
{
    "output": "main.css",
    "inherit": "base.css",
    "include": [
        {
            "file": "style.css",
            "sections": [
                "common", "unused"]                    },
        {
            "file": "style2.css",
            "sections": [
                "red-table"
            ]
        }
    ]
}
```

**output**: *Required*. The path/ name for the output CSS that will be included in the HTML.
**inherit**: *Optional*. The CSS file whose rules will be included at the begin of the generated CSS. This is mostly useful when including a custom page-specific rule or page specific variables.
**incude**: *Optional*. This is an array of objects. Each list item defines two things:
- **file** - The input file from which blocks have to be extracted.
- **sections** - A list of blocks that need to be extracted from the particular file.

The blocks mentioned in the ```sections``` of ```tez-css.congif``` needs to be defined in the input stylesheets using comments.

Example ```style.css```:
```css
/* BEGINCOMPONENT: common */
p {
    color: red;
}
/* ENDCOMPONENT: common */

/* BEGINCOMPONENT: outline-button */
.outline-button {
    background: white;
    color: black;
    border: 1px solid black;
    border-radius: 4px;
}
/* ENDCOMPONENT: outline-button */

/* BEGINCOMPONENT: unused */
.unused {
    background: blue;
}
/* ENDCOMPONENT: unused */
```
Example ```style2.css```
```css
/* BEGINCOMPONENT: blue-table */
table {
    width: 75%;
}

.blue-table thead {
    background: navy;
}

.blue-table tr {
    color: navy;
}
/* ENDCOMPONENT: blue-table */ 


/* BEGINCOMPONENT: red-table */
table {
    width: 50%;
}

.blue-table thead {
    background: pink;
}

.blue-table tr {
    color: pink;
}
/* ENDCOMPONENT: red-table */ 
```
Beginning of a block is defined by: ```/* BEGINCOMPONENT: <block-name> */```
End of a block is defined by: ```/* ENDCOMPONENT: <block-name> */```
The ```<block-name>``` can be ```[a-zA-Z0-9_-]+```

After the input CSS and the tez-css.config has been setup:
Run ```npx tez-css``` in the directory that contains your tez config file. 

Generated ```main.css```:
```css
/* BEGINCOMPONENT: common */
p {
    color: red;
}
/* ENDCOMPONENT: common */

/* BEGINCOMPONENT: unused */
.unused {
    background: blue;
}
/* ENDCOMPONENT: unused */
/* BEGINCOMPONENT: red-table */
table {
    width: 50%;
}

.blue-table thead {
    background: pink;
}

.blue-table tr {
    color: pink;
}
/* ENDCOMPONENT: red-table */ 
```

## Todo

[] Extend the ```inherits``` property.
[] More CMD Options