use gtk::prelude::*;
use relm4::prelude::*;

pub struct SpinnerSpinningCustomSize;

#[relm4::component(pub)]
impl SimpleComponent for SpinnerSpinningCustomSize {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Spinner {
            set_spinning: true,
            set_size_request: (24, 24),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
