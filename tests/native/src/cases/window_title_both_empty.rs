use relm4::adw;
use relm4::prelude::*;

pub struct WindowTitleBothEmpty;

#[relm4::component(pub)]
impl SimpleComponent for WindowTitleBothEmpty {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        adw::WindowTitle {
            set_title: "",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
