import { Application } from '@hotwired/stimulus'
import { eagerLoadControllersFrom } from '@hotwired/stimulus-loading'

const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus = application

// Import and register controllers from the importmap via common_controllers/**/*_controller
eagerLoadControllersFrom('common_controllers', application)
