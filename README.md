# Portfolio

Fine Art Portfolio

Todo:
#### CMS - Pure React
* [ ] Find all relevant thumbnail folder/image
* [x] Download current thumbnails
* [x] Deleting thumbnails deletes image and updates JSON
* [x] Allow remaking/editing of existing thumbnail and change/update text - x,y and zoom of thum preserved 
* [x] Upload image/choose thumbnail/upload thumbnail
* [x] Add info for image - [JSON stored on S3](https://dev.to/aws-builders/using-aws-s3-as-a-database-17l0)
* [ ] Drag-drop reorder of thumbnails
* [ ] Will exist as a subdomain...updating site will trigger a rebuild via GitHub Actions maybe through [`repository_dispatch`](https://stackoverflow.com/questions/68147899/whats-is-the-difference-between-repository-dispatch-and-workflow-dispatch-in-git)


#### NextJS
* [ ] `getStaticProps` to call s3 methods. Populate thumbnails and main image.
* [ ] Grab JSON for file info
* [ ] Image display via carousel run by framer-motion
* [ ] Header component
* [ ] About component
* [ ] Thumbnail component
* [ ] Image presentation component - pinch zoom on mobile
* [x] Upload thumbnail
* [x] Upload main image
