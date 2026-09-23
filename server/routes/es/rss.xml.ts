import { blogFeed } from '../../utils/feed'

export default defineEventHandler(event => blogFeed(event, 'es'))
