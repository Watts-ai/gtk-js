use gtk::prelude::*;
use relm4::prelude::*;

pub struct SwitchOffDefault;

#[relm4::component(pub)]
impl SimpleComponent for SwitchOffDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Switch {
            // Off by default
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
