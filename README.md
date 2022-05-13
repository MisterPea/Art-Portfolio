Fine Art Portfolio
---
This repository consists of two parts:
* A SSR desktop-only CMS system
* A SSR portfolio website

Todo:
#### CMS - NextJS SSR - Concived for desktop use only. 
* [x] Find all relevant thumbnails per gallery. e.g. All/Polychrome/Monochrome
* [x] Download current thumbnails
* [x] Deleting thumbnails deletes image and updates JSON
* [x] Allow remaking/editing of existing thumbnail and change/update text - x,y and zoom of thum preserved 
* [x] Upload image/choose thumbnail/upload thumbnail
* [x] Add info for image - [JSON stored on S3](https://dev.to/aws-builders/using-aws-s3-as-a-database-17l0)
* [x] Drag reorder of thumbnails
* [x] Add auth to prevent unauthorized edits
* [x] Update database on reorder and before navigation away from site (if needed)
* [ ] Will exist as a subdomain...updating site will trigger a rebuild via GitHub Actions maybe through [`repository_dispatch`](https://stackoverflow.com/questions/68147899/whats-is-the-difference-between-repository-dispatch-and-workflow-dispatch-in-git)
* [x] Tablet/Desktop Layout
* [x] Add components and plumbing to create a blurDataHash 


#### NextJS
* [x] ~~`getStaticProps` to call s3 methods. Populate thumbnails and main image.
* [x] Import images and data through local folder 
* [x] Grab JSON for file info
* [x] Image display via carousel run by framer-motion
* [x] Header component
* [x] About component
* [x] Thumbnail component
* [ ] Image presentation component - pinch zoom on mobile
* [x] Upload thumbnail
* [x] Upload main image
* [x] Arrow navigation - Esc to close modal
* [x] Add decoding of blurDataHash to base64 jpeg
* [ ] Add Favicon
* [ ] Add Head(s) and optimize caching
