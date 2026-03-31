import { Controller } from '@hotwired/stimulus'
import { approved_domain_path } from 'routes'

export default class extends Controller {
  static targets = ['email', 'regular', 'joinTeam', 'joinField'];
  manual_url = false;

  connect() {
    this.toggle_existing_team_form(false);
    this.check_approved_domain();
  }

  email_changed(event) {
    if (this.manual_url) {
      return;
    }

    this.check_approved_domain();
  }

  check_approved_domain() {
    const email = this.emailTarget.value

    // if user explicitly clicks a button saying they want a new dedicated account
    if (this.joinFieldTarget.value === 'false') {
      this.toggle_existing_team_form(false)
      return
    }

    if (email.length > 0 && email.includes('@')) {
      fetch(approved_domain_path({ email }))
        .then(response => response.json())
        .then(data => {
          this.toggle_existing_team_form(data.approved)
        })
    }
  }

  toggle_existing_team_form(domainApproved) {
    this.regularTargets.forEach(target => target.classList.toggle('hidden', domainApproved));
    this.joinTeamTargets.forEach(target => target.classList.toggle('hidden', !domainApproved));
  }

  do_join() {
    this.joinFieldTarget.value = 'true';
  }

  // if user explicitly clicks a button saying they want a new dedicated account
  do_not_join(event) {
    this.joinFieldTarget.value = 'false';
    event.preventDefault()
    event.stopPropagation();
    this.check_approved_domain();
  }

  url_changed(event) {
    this.manual_url = true;
  }
}
