use gtk::prelude::*;
use relm4::prelude::*;

pub struct SpinnerSpinning;

#[relm4::component(pub)]
impl SimpleComponent for SpinnerSpinning {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Spinner {
            set_spinning: true,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
