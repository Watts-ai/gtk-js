use gtk::prelude::*;
use relm4::prelude::*;

pub struct SwitchActive;

#[relm4::component(pub)]
impl SimpleComponent for SwitchActive {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Switch {
            set_active: true,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
